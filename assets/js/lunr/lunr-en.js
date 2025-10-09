---
layout: none
---

var idx = lunr(function () {
  // 인덱스에 사용할 필드 정의
  this.field('title')
  this.field('excerpt')
  this.field('categories')
  this.field('tags')

  // 문서의 고유 식별자로 사용할 필드
  this.ref('id')

  // 기본 파이프라인에서 trimmer(토큰 양끝 공백/특수문자 제거)를 제거합니다.
  // (원문 소스가 이미 원하는 형태로 전처리되어 있을 때 사용합니다.)
  this.pipeline.remove(lunr.trimmer)

  // Jekyll이 생성한 `store` 객체(페이지/포스트 메타)를 순회하여 인덱스에 추가합니다.
  // store의 키가 id 역할을 하며, 내부에 title/excerpt/categories/tags 등의 값을 가져옵니다.
  for (var item in store) {
    this.add({
      title: store[item].title,
      excerpt: store[item].excerpt,
      categories: store[item].categories,
      tags: store[item].tags,
      id: item
    })
  }
});

// DOM이 준비되면 검색 입력에 키업 이벤트 핸들러를 붙입니다.
$(document).ready(function() {
  // 검색 인풋(#search)에 타이핑할 때마다 실행됩니다.
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');

    // 사용자가 입력한 쿼리를 소문자로 만듭니다(검색어 비교를 단순화).
    var query = $(this).val().toLowerCase();

    // Lunr의 query builder를 사용해 복합 쿼리를 구성합니다.
    // 각 토큰에 대해 3가지 수준의 매칭을 시도합니다:
    // 1) pipeline을 통해 처리된 정확 토큰(boost 100)
    // 2) 와일드카드(후위 와일드카드)로 접미사 검색(boost 10)
    // 3) 편집 거리 1의 퍼지 매칭(editDistance:1, boost 1)
    var result =
      idx.query(function (q) {
        // 토큰 분리는 lunr.tokenizer.separator를 사용
        query.split(lunr.tokenizer.separator).forEach(function (term) {
          // 기본(파이프라인 적용) 형태의 강한 부스트
          q.term(term, { boost: 100 })

          // 사용자가 단어를 완전히 입력(끝에 공백이 아닌 경우)했다면
          // 접미사 와일드카드를 추가해 부분 일치도 허용
          if(query.lastIndexOf(" ") != query.length-1){
            q.term(term, {  usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 })
          }

          // 마지막으로 편집 거리 1짜리 퍼지 매칭을 추가
          if (term != ""){
            q.term(term, {  usePipeline: false, editDistance: 1, boost: 1 })
          }
        })
      });

    // 기존 결과 비우기
    resultdiv.empty();

    // 결과 개수 표시(국제화 텍스트는 Liquid로 주입됨)
    resultdiv.prepend('<p class="results__found">'+result.length+' {{ site.data.ui-text[site.locale].results_found | default: "Result(s) found" }}</p>');

    // Lunr이 반환한 result는 배열 형태입니다. for..in 대신 인덱스 반복이 더 안전합니다.
    for (var item in result) {
      // 각 결과 요소의 참조(ref)는 우리가 인덱스할 때 쓴 id입니다.
      var ref = result[item].ref;

      // store[ref]에 대응하는 문서가 있다고 가정하고 내용을 읽어옵니다.
      // (실제로는 안전하게 존재 여부를 확인하는 체크를 추가하면 더 안전합니다.)
      if(store[ref].teaser){
        // teaser 이미지가 있을 때 출력할 마크업
        var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<div class="archive__item-teaser">'+
                '<img src="'+store[ref].teaser+'" alt="">'+
              '</div>'+
              // excerpt는 공백 단위로 잘라 앞 20단어만 표시합니다.
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt.split(" ").splice(0,20).join(" ")+'...</p>'+
            '</article>'+
          '</div>';
      }
      else{
        // teaser 이미지가 없을 때의 기본 마크업
        var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt.split(" ").splice(0,20).join(" ")+'...</p>'+
            '</article>'+
          '</div>';
      }

      // 생성한 HTML을 결과 컨테이너에 붙입니다.
      // 보안상의 이유로 store에서 온 텍스트를 직접 innerHTML로 넣는 방식은
      // XSS 위험이 있으니, 사용자 생성 컨텐츠가 포함될 가능성이 있으면
      // escape 처리하거나 DOM API로 textContent를 설정する 방법に改变してください.
      resultdiv.append(searchitem);
    }
  });
});
